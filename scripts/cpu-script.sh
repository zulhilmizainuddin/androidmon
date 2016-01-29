while true;
    do result=$(top -d 1 -n 1 | grep -e %s$);
        if [ $? -eq 0 ];
            then if [ -n "$result" ];
                then array=($result);
                echo "${array[2]} ${array[0]} ${array[4]}";
            else echo "0 0 0";
            fi;
        else echo "0 0 0";
        fi;
    done