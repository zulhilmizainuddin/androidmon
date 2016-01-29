while true;
    do result=$(dumpsys meminfo %s | grep TOTAL);
        if [ $? -eq 0 ];
            then if [ -n "$result" ];
                    then array=($result);
                    echo "${array[1]} ${array[2]} ${array[3]}";
                else echo "0 0 0";
            fi;
        else echo "0 0 0";
        fi;
        sleep 1;
    done